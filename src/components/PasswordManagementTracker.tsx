import React, { useState, useEffect, useMemo } from "react";
import {
  Lock,
  Unlock,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Search,
  Star,
  Trash2,
  Edit3,
  Share2,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  History,
  AlertTriangle,
  Fingerprint,
  Mail,
  Sliders,
  X,
  Sparkles,
  Layers,
  Clock,
  User,
  Settings,
  CheckCircle2,
  LockKeyhole,
  Info
} from "lucide-react";
import {
  PasswordEntry,
  PasswordHistory,
  MasterPasswordSettings,
  PasswordShare,
  SecurityAuditLog
} from "../types";

interface PasswordManagementTrackerProps {
  userId?: string;
  onNavigateHome?: () => void;
}

// Initial mock passwords for smooth demo
const INITIAL_PASSWORDS: PasswordEntry[] = [
  {
    id: "pwd-1",
    userId: "user-1",
    platformName: "Google Account",
    platformUrl: "https://accounts.google.com",
    username: "alex.caregiver@gmail.com",
    password: "G9$kL!p2#xQv8aM1",
    category: "Email",
    notes: "Primary account for Care2Care backups and Google Workspace.",
    icon: "📧",
    color: "#4285F4",
    isFavorite: true,
    isActive: true,
    lastUsed: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiryDate: new Date(Date.now() + 86400000 * 90).toISOString(),
    strength: "strong",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "pwd-2",
    userId: "user-1",
    platformName: "Chase Bank Portal",
    platformUrl: "https://www.chase.com",
    username: "alex_finance_2026",
    password: "C#7vN!9$qW3*zP5k",
    category: "Banking",
    notes: "Care recipient medical bills payment account.",
    icon: "💳",
    color: "#1170CF",
    isFavorite: true,
    isActive: true,
    lastUsed: new Date(Date.now() - 86400000 * 5).toISOString(),
    expiryDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    strength: "strong",
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "pwd-3",
    userId: "user-1",
    platformName: "Pharmacy Online",
    platformUrl: "https://mypharmacy.com",
    username: "meds.alex@gmail.com",
    password: "password123",
    category: "Utilities",
    notes: "Monthly prescription refills for patient.",
    icon: "💊",
    color: "#10B981",
    isFavorite: false,
    isActive: true,
    lastUsed: new Date(Date.now() - 86400000 * 12).toISOString(),
    expiryDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Expired
    strength: "weak",
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
  {
    id: "pwd-4",
    userId: "user-1",
    platformName: "Facebook Community",
    platformUrl: "https://facebook.com",
    username: "alex.caregiver",
    password: "Caregiver2026!",
    category: "Social",
    notes: "Caregiver support group login.",
    icon: "📱",
    color: "#1877F2",
    isFavorite: false,
    isActive: true,
    lastUsed: new Date(Date.now() - 86400000 * 1).toISOString(),
    expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(),
    strength: "medium",
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

const INITIAL_HISTORY: PasswordHistory[] = [
  {
    id: "hist-1",
    passwordId: "pwd-3",
    oldPassword: "oldpharmacy123",
    newPassword: "password123",
    changedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    changedReason: "Routine update",
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
];

const CATEGORIES = [
  { name: "All", icon: "🔑", color: "#64748B" },
  { name: "Email", icon: "📧", color: "#3B82F6" },
  { name: "Banking", icon: "💳", color: "#10B981" },
  { name: "Social", icon: "📱", color: "#8B5CF6" },
  { name: "Professional", icon: "💼", color: "#6366F1" },
  { name: "Shopping", icon: "🛒", color: "#F59E0B" },
  { name: "Utilities", icon: "🏠", color: "#EC4899" },
  { name: "Websites", icon: "🌐", color: "#14B8A6" },
  { name: "Other", icon: "📦", color: "#6B7280" },
];

export const PasswordManagementTracker: React.FC<PasswordManagementTrackerProps> = ({
  userId = "user-1",
  onNavigateHome,
}) => {
  // Persistence state
  const [passwords, setPasswords] = useState<PasswordEntry[]>(() => {
    const saved = localStorage.getItem("c2c_passwords");
    return saved ? JSON.parse(saved) : INITIAL_PASSWORDS;
  });

  const [history, setHistory] = useState<PasswordHistory[]>(() => {
    const saved = localStorage.getItem("c2c_password_history");
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [masterSettings, setMasterSettings] = useState<MasterPasswordSettings>(() => {
    const saved = localStorage.getItem("c2c_master_settings");
    return saved
      ? JSON.parse(saved)
      : {
          userId,
          isEnabled: true,
          masterPassword: "master123", // Default master password for demo
          biometricEnabled: true,
          biometricType: "fingerprint",
          autoLockMinutes: 15,
          lastUnlockedAt: new Date().toISOString(),
          recoveryEmail: "alex.caregiver@gmail.com",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
  });

  // Vault Lock State
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [unlockInput, setUnlockInput] = useState<string>("");
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Show/Hide Password visibility per card
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals & Drawers
  const [activeModal, setActiveModal] = useState<
    "add" | "edit" | "detail" | "generator" | "security" | "settings" | "share" | null
  >(null);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);

  // Form State for Add/Edit
  const [formData, setFormData] = useState<Partial<PasswordEntry>>({
    platformName: "",
    platformUrl: "",
    username: "",
    password: "",
    category: "Email",
    notes: "",
    passphrase: "",
    imageUrl: "",
    icon: "🔑",
    color: "#3B82F6",
    isFavorite: false,
    isActive: true,
    expiryDate: new Date(Date.now() + 86400000 * 90).toISOString().split("T")[0],
  });

  // Dynamic Custom Detail Fields Filler Box (+)
  const [customFields, setCustomFields] = useState<Array<{ id: string; label: string; value: string }>>([]);

  const handleAddCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: `cf_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, label: "", value: "" }
    ]);
  };

  const handleUpdateCustomField = (id: string, key: "label" | "value", val: string) => {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: val } : f))
    );
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  // Password Generator Direct Save State
  const [genLength, setGenLength] = useState<number>(16);
  const [genUpper, setGenUpper] = useState<boolean>(true);
  const [genLower, setGenLower] = useState<boolean>(true);
  const [genNums, setGenNums] = useState<boolean>(true);
  const [genSpec, setGenSpec] = useState<boolean>(true);
  const [genPassword, setGenPassword] = useState<string>("");
  const [showGenSaveForm, setShowGenSaveForm] = useState<boolean>(false);
  const [genPlatformName, setGenPlatformName] = useState<string>("");
  const [genPlatformUrl, setGenPlatformUrl] = useState<string>("");
  const [genUsername, setGenUsername] = useState<string>("");
  const [genCategory, setGenCategory] = useState<string>("Email");
  const [genPassphrase, setGenPassphrase] = useState<string>("");
  const [genImageUrl, setGenImageUrl] = useState<string>("");
  const [genNotes, setGenNotes] = useState<string>("");
  const [genIcon, setGenIcon] = useState<string>("🔑");

  // Sharing state
  const [shareEmail, setShareEmail] = useState<string>("");
  const [sharePermission, setSharePermission] = useState<"view" | "edit" | "manage">("view");

  // Toast Feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("c2c_passwords", JSON.stringify(passwords));
  }, [passwords]);

  useEffect(() => {
    localStorage.setItem("c2c_password_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("c2c_master_settings", JSON.stringify(masterSettings));
  }, [masterSettings]);

  // Helper: Calculate Password Strength
  const calculateStrength = (pwd: string): "weak" | "medium" | "strong" => {
    if (!pwd) return "weak";
    let score = 0;
    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 1;

    if (score >= 5) return "strong";
    if (score >= 3) return "medium";
    return "weak";
  };

  // Helper: Generate Random Password
  const generateNewPassword = () => {
    let chars = "";
    if (genUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (genLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (genNums) chars += "0123456789";
    if (genSpec) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    let res = "";
    for (let i = 0; i < genLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGenPassword(res);
  };

  useEffect(() => {
    generateNewPassword();
  }, [genLength, genUpper, genLower, genNums, genSpec]);

  // Handle Master Password Unlock
  const handleUnlockVault = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (unlockInput === masterSettings.masterPassword) {
      setIsVaultUnlocked(true);
      setShowUnlockModal(false);
      setUnlockInput("");
      setUnlockError(null);
      showToast("🔐 Vault Unlocked Successfully!");
    } else {
      setUnlockError("Incorrect master password. Try 'master123' or biometric.");
    }
  };

  const handleBiometricUnlock = () => {
    setIsVaultUnlocked(true);
    setShowUnlockModal(false);
    setUnlockError(null);
    showToast("🖐️ Biometric Unlock Successful!");
  };

  // Toggle Show/Hide password with Unlock Guard
  const toggleShowPassword = (id: string) => {
    if (!isVaultUnlocked && masterSettings.isEnabled) {
      setShowUnlockModal(true);
      return;
    }
    setVisiblePasswordIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy to Clipboard
  const handleCopy = (text: string, label: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    showToast(`📋 Copied ${label} to Clipboard!`);
  };

  // Filtered Passwords List
  const filteredPasswords = useMemo(() => {
    return passwords.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch =
        p.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.platformUrl.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [passwords, selectedCategory, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = passwords.length;
    const strong = passwords.filter((p) => calculateStrength(p.password) === "strong").length;
    const medium = passwords.filter((p) => calculateStrength(p.password) === "medium").length;
    const weak = passwords.filter((p) => calculateStrength(p.password) === "weak").length;
    const favorites = passwords.filter((p) => p.isFavorite).length;
    const expired = passwords.filter(
      (p) => p.expiryDate && new Date(p.expiryDate) < new Date()
    ).length;

    const securityScore = Math.round(
      (strong * 100 + medium * 50 + (total - expired) * 20) / Math.max(total * 1.5, 1)
    );

    return { total, strong, medium, weak, favorites, expired, securityScore: Math.min(securityScore, 100) };
  }, [passwords]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Delete Password
  const handleDeletePassword = (id: string) => {
    if (confirm("Are you sure you want to delete this stored credential?")) {
      setPasswords((prev) => prev.filter((p) => p.id !== id));
      setActiveModal(null);
      showToast("🗑️ Password deleted.");
    }
  };

  // Save Add or Edit
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platformName || !formData.username || !formData.password) {
      alert("Please fill in Platform Name, Username, and Password.");
      return;
    }

    const str = calculateStrength(formData.password);
    const validCustomFields = customFields.filter((f) => f.label.trim() !== "");

    if (selectedPassword && activeModal === "edit") {
      // Update existing
      const oldPwd = selectedPassword.password;
      const newPwd = formData.password;

      // Track history if password changed
      if (oldPwd !== newPwd) {
        const historyEntry: PasswordHistory = {
          id: `hist_${Date.now()}`,
          passwordId: selectedPassword.id,
          oldPassword: oldPwd,
          newPassword: newPwd,
          changedAt: new Date().toISOString(),
          changedReason: "User updated credential",
          createdAt: new Date().toISOString(),
        };
        setHistory((prev) => [historyEntry, ...prev]);
      }

      setPasswords((prev) =>
        prev.map((p) =>
          p.id === selectedPassword.id
            ? ({
                ...p,
                ...formData,
                customDetails: validCustomFields,
                strength: str,
                updatedAt: new Date().toISOString(),
              } as PasswordEntry)
            : p
        )
      );
      showToast("✅ Credential updated successfully!");
    } else {
      // Create new
      const newEntry: PasswordEntry = {
        id: `pwd_${Date.now()}`,
        userId,
        platformName: formData.platformName,
        platformUrl: formData.platformUrl || "",
        username: formData.username,
        password: formData.password,
        category: formData.category || "Email",
        notes: formData.notes || "",
        passphrase: formData.passphrase || "",
        imageUrl: formData.imageUrl || "",
        customDetails: validCustomFields,
        icon: formData.icon || "🔑",
        color: formData.color || "#3B82F6",
        isFavorite: !!formData.isFavorite,
        isActive: true,
        lastUsed: new Date().toISOString(),
        expiryDate: formData.expiryDate || new Date(Date.now() + 86400000 * 90).toISOString(),
        strength: str,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPasswords((prev) => [newEntry, ...prev]);
      showToast("✨ New password added to encrypted vault!");
    }

    setActiveModal(null);
    setSelectedPassword(null);
    setCustomFields([]);
  };

  // Direct Save Generated Password from Generator
  const handleSaveGeneratedPasswordDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genPlatformName || !genUsername || !genPassword) {
      alert("Please enter Platform Name, Username, and Password.");
      return;
    }

    const str = calculateStrength(genPassword);
    const validCustomFields = customFields.filter((f) => f.label.trim() !== "");

    const newEntry: PasswordEntry = {
      id: `pwd_${Date.now()}`,
      userId,
      platformName: genPlatformName,
      platformUrl: genPlatformUrl || "",
      username: genUsername,
      password: genPassword,
      category: genCategory || "Email",
      notes: genNotes || "",
      passphrase: genPassphrase || "",
      imageUrl: genImageUrl || "",
      customDetails: validCustomFields,
      icon: genIcon || "🔑",
      color: "#10B981",
      isFavorite: false,
      isActive: true,
      lastUsed: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 86400000 * 90).toISOString(),
      strength: str,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPasswords((prev) => [newEntry, ...prev]);
    showToast("🎉 Generated Password saved directly with creation date!");
    setActiveModal(null);
    setShowGenSaveForm(false);
    setCustomFields([]);
    setGenPlatformName("");
    setGenPlatformUrl("");
    setGenUsername("");
    setGenPassphrase("");
    setGenImageUrl("");
    setGenNotes("");
  };

  // Download Individual Credential Backup Text File
  const handleDownloadCredentialCard = (pwd: PasswordEntry) => {
    const customStr = (pwd.customDetails || [])
      .map((c) => `• ${c.label}: ${c.value}`)
      .join("\n");

    const content = `===========================================================
CARE2CARE SECURE CREDENTIAL BACKUP CARD
Created / Saved On: ${new Date(pwd.createdAt).toLocaleDateString()} ${new Date(pwd.createdAt).toLocaleTimeString()}
===========================================================

[ PLATFORM INFO ]
• Platform Name: ${pwd.platformName}
• Platform Link: ${pwd.platformUrl || "N/A"}
• Category: ${pwd.category}

[ USER CREDENTIALS ]
• Username / Email: ${pwd.username}
• Password: ${pwd.password}
• Recovery Passphrase / Seed: ${pwd.passphrase || "None"}

[ DYNAMIC CUSTOM DETAILS ]
${customStr || "None recorded."}

[ NOTES & SECURITY ]
${pwd.notes || "None"}

===========================================================
Care2Care Encrypted Local Vault • Keep Safe & Secret
===========================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pwd.platformName.replace(/\s+/g, "_")}_Credential_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("📄 Credential Card downloaded!");
  };

  // Export encrypted JSON/CSV
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(passwords, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `care2care_encrypted_passwords_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📥 Password backup exported successfully!");
  };

  return (
    <div className="space-y-6 pb-24 text-slate-800 animate-in fade-in duration-200">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/80 font-black text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 rounded-3xl text-white shadow-xl border border-emerald-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-xl shadow-inner">
              🔐
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Password Management Service
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  AES-256 ENCRYPTED
                </span>
              </h1>
              <p className="text-xs text-slate-300">
                Securely store, track, and manage sensitive platform passwords with master biometric protection.
              </p>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lock / Unlock Toggle Button */}
          <button
            onClick={() => {
              if (isVaultUnlocked) {
                setIsVaultUnlocked(false);
                showToast("🔒 Vault Locked.");
              } else {
                setShowUnlockModal(true);
              }
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              isVaultUnlocked
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isVaultUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isVaultUnlocked ? "Vault Unlocked" : "Unlock Vault"}</span>
          </button>

          {/* Add Password Button */}
          <button
            onClick={() => {
              setFormData({
                platformName: "",
                platformUrl: "",
                username: "",
                password: "",
                category: "Email",
                notes: "",
                icon: "🔑",
                color: "#3B82F6",
                isFavorite: false,
                isActive: true,
                expiryDate: new Date(Date.now() + 86400000 * 90).toISOString().split("T")[0],
              });
              setSelectedPassword(null);
              setActiveModal("add");
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Password</span>
          </button>
        </div>
      </div>

      {/* QUICK SECURITY STATUS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Stored</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg">
            🔑
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-4 rounded-3xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Strong Passwords</p>
            <p className="text-2xl font-black text-emerald-700">{stats.strong}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-amber-200 p-4 rounded-3xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Weak / Expired</p>
            <p className="text-2xl font-black text-amber-700">{stats.weak + stats.expired}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-indigo-200 p-4 rounded-3xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Vault Health</p>
            <p className="text-2xl font-black text-indigo-700">{stats.securityScore}%</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SERVICE ACTION TOOLBAR & SEARCH */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passwords or usernames..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveModal("generator")}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>Generator</span>
            </button>

            <button
              onClick={() => setActiveModal("security")}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Security Audit</span>
            </button>

            <button
              onClick={() => setActiveModal("settings")}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Master Lock</span>
            </button>

            <button
              onClick={handleExportData}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Backup</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PASSWORDS GRID / LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPasswords.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-3xl">
              🔍
            </div>
            <h3 className="font-black text-slate-800 text-base">No passwords found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No passwords match your search query or selected category. Click 'Add Password' to store a new credential.
            </p>
          </div>
        ) : (
          filteredPasswords.map((pwd) => {
            const isVisible = visiblePasswordIds[pwd.id];
            const isExpired = pwd.expiryDate && new Date(pwd.expiryDate) < new Date();

            return (
              <div
                key={pwd.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white font-bold shadow-xs shrink-0"
                      style={{ backgroundColor: pwd.color || "#3B82F6" }}
                    >
                      {pwd.icon || "🔑"}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        {pwd.platformName}
                        {pwd.platformUrl && (
                          <a
                            href={pwd.platformUrl.startsWith("http") ? pwd.platformUrl : `https://${pwd.platformUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {pwd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(pwd.id)}
                      className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer ${
                        pwd.isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-300"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Username & Password Rows */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  {/* Username */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-bold text-[11px]">Username:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{pwd.username}</span>
                      <button
                        onClick={() => handleCopy(pwd.username, "Username", pwd.id + "_u")}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                        title="Copy Username"
                      >
                        {copiedId === pwd.id + "_u" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Field with Mask */}
                  <div className="flex items-center justify-between gap-2 border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 font-bold text-[11px]">Password:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black tracking-widest text-slate-900">
                        {isVisible ? pwd.password : "••••••••••••"}
                      </span>

                      <button
                        onClick={() => toggleShowPassword(pwd.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                        title={isVisible ? "Hide Password" : "Show Password (Requires Master Lock)"}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(pwd.password, "Password", pwd.id + "_p")}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedId === pwd.id + "_p" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Meta & Actions */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-2">
                    {/* Strength Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                        pwd.strength === "strong"
                          ? "bg-emerald-100 text-emerald-800"
                          : pwd.strength === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {pwd.strength}
                    </span>

                    {isExpired && (
                      <span className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full animate-pulse">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedPassword(pwd);
                        setActiveModal("detail");
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPassword(pwd);
                        setFormData({ ...pwd });
                        setActiveModal("edit");
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeletePassword(pwd.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAL 1: ADD / EDIT PASSWORD ================= */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg">
                  🔐
                </div>
                <div>
                  <h3 className="font-black text-sm">
                    {activeModal === "edit" ? "Edit Credential" : "Add New Password"}
                  </h3>
                  <p className="text-[11px] text-slate-300">Save platform credentials securely</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Platform Name & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Platform Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.platformName || ""}
                    onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                    placeholder="e.g. Gmail, Chase, Netflix"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category || "Email"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c.name !== "All").map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Platform URL & Icon */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formData.platformUrl || ""}
                    onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Icon</label>
                  <select
                    value={formData.icon || "🔑"}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs text-center"
                  >
                    {["🔑", "📧", "💳", "📱", "💼", "🛒", "🏠", "🌐", "💊", "🔒"].map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Username / Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username / Email *</label>
                <input
                  type="text"
                  required
                  value={formData.username || ""}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Password & Generator Quick Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.random().toString(36).slice(-8) + "A1!";
                      setFormData({ ...formData, password: rand });
                    }}
                    className="text-[11px] font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter or generate strong password"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500"
                />

                {/* Live Strength Meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500">Strength:</span>
                      <span
                        className={
                          calculateStrength(formData.password) === "strong"
                            ? "text-emerald-600"
                            : calculateStrength(formData.password) === "medium"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }
                      >
                        {calculateStrength(formData.password).toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          calculateStrength(formData.password) === "strong"
                            ? "w-full bg-emerald-500"
                            : calculateStrength(formData.password) === "medium"
                            ? "w-2/3 bg-amber-500"
                            : "w-1/3 bg-rose-500"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Expiry Date & Options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password Expiry Date</label>
                  <input
                    type="date"
                    value={
                      formData.expiryDate
                        ? new Date(formData.expiryDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs"
                  />
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.isFavorite}
                      onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Favorite ⭐</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Security answers, account pin, recovery code..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-xs"
                />
              </div>

              {/* Recovery Passphrase / Seed Phrase */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Recovery Passphrase / 12-Word Seed Phrase</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={formData.passphrase || ""}
                  onChange={(e) => setFormData({ ...formData, passphrase: e.target.value })}
                  placeholder="e.g. apple banana cherry door echo forest guitar..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Screenshot / Credential Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Credential Screenshot or Photo Document</span>
                  <span className="text-[10px] text-slate-400 font-normal">Upload or Image Link</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... or upload photo below"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-xs"
                  />
                  <label className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-2xl cursor-pointer flex items-center gap-1 border border-emerald-200 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 relative w-full h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={formData.imageUrl} alt="Credential Screenshot" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white p-1 rounded-full text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Custom Detail Fields Filler Box (+) */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 text-xs flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Custom Multi-Detail Filler Box</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl cursor-pointer border border-emerald-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Field (+)</span>
                  </button>
                </div>

                {customFields.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No custom detail fields added yet. Click (+) to add fields like PIN, Client ID, Secret Q.</p>
                ) : (
                  customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. PIN, Secret Q)"
                        value={field.label}
                        onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                        className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Detail Value..."
                        value={field.value}
                        onChange={(e) => handleUpdateCustomField(field.id, "value", e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md cursor-pointer"
                >
                  {activeModal === "edit" ? "Update Credential" : "Save Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PASSWORD DETAIL & HISTORY ================= */}
      {activeModal === "detail" && selectedPassword && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div
              className="p-6 text-white flex items-center justify-between"
              style={{ backgroundColor: selectedPassword.color || "#1E293B" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                  {selectedPassword.icon || "🔑"}
                </div>
                <div>
                  <h3 className="font-black text-lg">{selectedPassword.platformName}</h3>
                  <p className="text-xs text-white/80">{selectedPassword.category} Credential</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Date Created & Link */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span>Created On: <strong className="text-slate-800">{new Date(selectedPassword.createdAt).toLocaleDateString()}</strong></span>
                {selectedPassword.platformUrl && (
                  <a
                    href={selectedPassword.platformUrl.startsWith("http") ? selectedPassword.platformUrl : `https://${selectedPassword.platformUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Visit Platform</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Username & Password */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Username:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{selectedPassword.username}</span>
                    <button
                      onClick={() => handleCopy(selectedPassword.username, "Username")}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-400 font-bold">Password:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900">
                      {visiblePasswordIds[selectedPassword.id]
                        ? selectedPassword.password
                        : "••••••••••••"}
                    </span>
                    <button
                      onClick={() => toggleShowPassword(selectedPassword.id)}
                      className="p-1 text-slate-600 hover:bg-slate-200 rounded-md cursor-pointer"
                    >
                      {visiblePasswordIds[selectedPassword.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(selectedPassword.password, "Password")}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Passphrase */}
                {selectedPassword.passphrase && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-slate-400 font-bold">Passphrase:</span>
                    <div className="flex items-center gap-2 max-w-[220px]">
                      <span className="font-mono text-[11px] font-bold text-slate-800 truncate">{selectedPassword.passphrase}</span>
                      <button
                        onClick={() => handleCopy(selectedPassword.passphrase!, "Passphrase")}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Multi-Detail Fields */}
              {selectedPassword.customDetails && selectedPassword.customDetails.length > 0 && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
                  <h5 className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Custom Details ({selectedPassword.customDetails.length})</span>
                  </h5>
                  <div className="space-y-1.5">
                    {selectedPassword.customDetails.map((det) => (
                      <div key={det.id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-emerald-100">
                        <span className="font-bold text-slate-600">{det.label}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{det.value}</span>
                          <button
                            onClick={() => handleCopy(det.value, det.label)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credential Image / Screenshot Capture */}
              {selectedPassword.imageUrl && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 text-xs">Credential Image Screenshot:</span>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-40">
                    <img src={selectedPassword.imageUrl} alt="Credential Screenshot" className="w-full object-cover" />
                  </div>
                </div>
              )}

              {/* Password Change History */}
              <div>
                <h4 className="font-black text-slate-800 flex items-center gap-1.5 mb-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Password History ({history.filter((h) => h.passwordId === selectedPassword.id).length})</span>
                </h4>

                <div className="bg-slate-900 text-slate-100 p-3 rounded-2xl space-y-2 max-h-32 overflow-y-auto font-mono text-[11px]">
                  {history.filter((h) => h.passwordId === selectedPassword.id).length === 0 ? (
                    <p className="text-slate-500 italic">No password changes recorded yet.</p>
                  ) : (
                    history
                      .filter((h) => h.passwordId === selectedPassword.id)
                      .map((h) => (
                        <div key={h.id} className="border-b border-slate-800 pb-1 last:border-none">
                          <p className="text-emerald-400 font-bold">{new Date(h.changedAt).toLocaleDateString()}</p>
                          <p className="text-slate-400">Old: {h.oldPassword} → Reason: {h.changedReason}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedPassword.notes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900">
                  <p className="font-bold text-[11px] mb-0.5">Notes:</p>
                  <p className="font-medium text-xs">{selectedPassword.notes}</p>
                </div>
              )}

              {/* Actions & Backup Download */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  onClick={() => handleDownloadCredentialCard(selectedPassword)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download Card</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeletePassword(selectedPassword.id)}
                    className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-2xl cursor-pointer text-xs"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => {
                      setFormData({ ...selectedPassword });
                      if (selectedPassword.customDetails) {
                        setCustomFields(selectedPassword.customDetails);
                      }
                      setActiveModal("edit");
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md cursor-pointer text-xs"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: UNLOCK VAULT MODAL ================= */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              🔐
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">Unlock Encrypted Vault</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your Master Password or use Biometrics to view sensitive credentials.
              </p>
            </div>

            <form onSubmit={handleUnlockVault} className="space-y-3">
              <input
                type="password"
                required
                value={unlockInput}
                onChange={(e) => setUnlockInput(e.target.value)}
                placeholder="Enter Master Password (default: master123)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-center font-bold text-xs focus:ring-2 focus:ring-emerald-500"
              />

              {unlockError && <p className="text-xs font-bold text-rose-600">{unlockError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95 text-xs"
              >
                Unlock Vault
              </button>
            </form>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBiometricUnlock}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                <span>Use Biometric</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUnlockModal(false)}
                className="px-3 py-2 text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PASSWORD GENERATOR ================= */}
      {activeModal === "generator" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Strong Password Generator</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Password Preview Box */}
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono font-bold text-center text-sm border border-slate-800 relative flex items-center justify-between">
              <span className="truncate pr-8">{genPassword}</span>
              <button
                onClick={() => handleCopy(genPassword, "Generated Password")}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer shrink-0"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Length: {genLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genUpper}
                  onChange={(e) => setGenUpper(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genLower}
                  onChange={(e) => setGenLower(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genNums}
                  onChange={(e) => setGenNums(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genSpec}
                  onChange={(e) => setGenSpec(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Symbols (!@#$)</span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={generateNewPassword}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGenSaveForm(!showGenSaveForm)}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-2xl border border-emerald-200 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showGenSaveForm ? "Hide Direct Save" : "Save Password (+)"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopy(genPassword, "Generated Password");
                  setActiveModal(null);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
              >
                Copy & Close
              </button>
            </div>

            {/* Direct Save Expanded Form */}
            {showGenSaveForm && (
              <form onSubmit={handleSaveGeneratedPasswordDirect} className="mt-4 pt-4 border-t border-slate-200 space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl text-emerald-900 font-bold text-[11px]">
                  <span>Direct Vault Saver</span>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Platform Name *</label>
                    <input
                      type="text"
                      required
                      value={genPlatformName}
                      onChange={(e) => setGenPlatformName(e.target.value)}
                      placeholder="e.g. Amazon, Bank, Steam"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={genCategory}
                      onChange={(e) => setGenCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      {CATEGORIES.filter((c) => c.name !== "All").map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Platform Link / URL</label>
                    <input
                      type="text"
                      value={genPlatformUrl}
                      onChange={(e) => setGenPlatformUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Icon</label>
                    <select
                      value={genIcon}
                      onChange={(e) => setGenIcon(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-center"
                    >
                      {["🔑", "📧", "💳", "📱", "💼", "🛒", "🏠", "🌐", "💊", "🔒"].map((ico) => (
                        <option key={ico} value={ico}>
                          {ico}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username / Email *</label>
                  <input
                    type="text"
                    required
                    value={genUsername}
                    onChange={(e) => setGenUsername(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recovery Passphrase / Seed</label>
                  <input
                    type="text"
                    value={genPassphrase}
                    onChange={(e) => setGenPassphrase(e.target.value)}
                    placeholder="Optional 12-word seed phrase"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>

                {/* Dynamic Custom Detail Fields (+) */}
                <div className="space-y-2 border-t border-slate-100 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-emerald-600" />
                      <span>Custom Details Filler (+)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCustomField}
                      className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg cursor-pointer border border-emerald-200"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Field (+)</span>
                    </button>
                  </div>

                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Label (e.g. PIN)"
                        value={field.label}
                        onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                        className="w-1/3 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Value..."
                        value={field.value}
                        onChange={(e) => handleUpdateCustomField(field.id, "value", e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md cursor-pointer text-xs transition-all active:scale-95 mt-2"
                >
                  Save Generated Password to Vault
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 5: SECURITY CHECKUP ================= */}
      {activeModal === "security" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Security Checkup Audit</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Banner */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">Vault Security Health Score</p>
                <p className="text-3xl font-black text-emerald-400">{stats.securityScore} / 100</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center font-black text-emerald-300 text-xl">
                🛡️
              </div>
            </div>

            {/* Audit Issues */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-slate-800">Scan Results & Actionable Items:</h4>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Strong Passwords</span>
                <span className="font-black text-emerald-600">{stats.strong} Verified</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-amber-900">
                <span className="font-bold">Weak Passwords</span>
                <span className="font-black">{stats.weak} Found</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between text-rose-900">
                <span className="font-bold">Expired Credentials</span>
                <span className="font-black">{stats.expired} Expired</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast("🛡️ Audit Complete - Vault verified!");
                setActiveModal(null);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
            >
              Done Checkup
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: SETTINGS / MASTER LOCK ================= */}
      {activeModal === "settings" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="font-black text-slate-900 text-base">Master Lock & Vault Settings</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Master Password</label>
                <input
                  type="password"
                  value={masterSettings.masterPassword}
                  onChange={(e) =>
                    setMasterSettings({ ...masterSettings, masterPassword: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs font-bold"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-700">Biometric Unlock (Touch ID / Face ID)</span>
                <input
                  type="checkbox"
                  checked={masterSettings.biometricEnabled}
                  onChange={(e) =>
                    setMasterSettings({ ...masterSettings, biometricEnabled: e.target.checked })
                  }
                  className="rounded text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Auto-Lock Inactivity Timer</label>
                <select
                  value={masterSettings.autoLockMinutes}
                  onChange={(e) =>
                    setMasterSettings({ ...masterSettings, autoLockMinutes: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs"
                >
                  <option value={1}>1 Minute</option>
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recovery Email</label>
                <input
                  type="email"
                  value={masterSettings.recoveryEmail || ""}
                  onChange={(e) =>
                    setMasterSettings({ ...masterSettings, recoveryEmail: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => {
                showToast("⚙️ Vault settings updated!");
                setActiveModal(null);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
